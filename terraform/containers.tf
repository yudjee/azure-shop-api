resource "azurerm_resource_group" "chatbot_rg" {
  name     = "rg-chatbot-sand-ne-001"
  location = "northeurope"
}

resource "azurerm_container_registry" "chatbot_acr" {
  name                = "yudjeechatbotacr"
  resource_group_name = azurerm_resource_group.chatbot_rg.name
  location            = azurerm_resource_group.chatbot_rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_log_analytics_workspace" "chatbot_log_analytics_workspace" {
  name                = "yudjee-log-analytics-chatbot"
  location            = azurerm_resource_group.chatbot_rg.location
  resource_group_name = azurerm_resource_group.chatbot_rg.name
}

resource "azurerm_container_app_environment" "chatbot_cae" {
  name                       = "yudjee-cae-chatbot"
  location                   = azurerm_resource_group.chatbot_rg.location
  resource_group_name        = azurerm_resource_group.chatbot_rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.chatbot_log_analytics_workspace.id
}

resource "azurerm_container_app" "chatbot_ca_docker_hub" {
  name                         = "yudjee-chatbot-ca-dh"
  container_app_environment_id = azurerm_container_app_environment.chatbot_cae.id
  resource_group_name          = azurerm_resource_group.chatbot_rg.name
  revision_mode                = "Single"

  registry {
    server               = "docker.io"
    username             = "yudjee"
    password_secret_name = "docker-io-pass"
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 3000

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }

  }

  template {
    container {
      name   = "yudjee-chatbot-container-dh"
      image  = "yudjee/container-app:latest"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "CONTAINER_REGISTRY_NAME"
        value = "Docker Hub"
      }
    }
  }

  secret {
    name  = "docker-io-pass"
    value = var.docker_hub_password
  }
}

resource "azurerm_container_app" "chatbot_ca_docker_acr" {
  name                         = "yudjee-chatbot-ca-acr"
  container_app_environment_id = azurerm_container_app_environment.chatbot_cae.id
  resource_group_name          = azurerm_resource_group.chatbot_rg.name
  revision_mode                = "Single"

  registry {
    server               = azurerm_container_registry.chatbot_acr.login_server
    username             = azurerm_container_registry.chatbot_acr.admin_username
    password_secret_name = "acr-password"
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 3000

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }

  }

  template {
    container {
      name   = "yudjee-chatbot-container-acr"
      image  = "${azurerm_container_registry.chatbot_acr.login_server}/container-app-acr:latest"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "CONTAINER_REGISTRY_NAME"
        value = "Azure Container Registry"
      }
    }
  }

  secret {
    name  = "acr-password"
    value = azurerm_container_registry.chatbot_acr.admin_password
  }
}