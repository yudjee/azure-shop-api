resource "azurerm_resource_group" "service_bus_rg" {
  name     = "my-ressource-group"
  location = "West Europe"
}

resource "azurerm_servicebus_namespace" "sb" {
  name                          = "sb-import-service"
  location                      = azurerm_resource_group.service_bus_rg.location
  resource_group_name           = azurerm_resource_group.service_bus_rg.name
  sku                           = "Basic"
  capacity                      = 0 /* standard for sku plan */
  public_network_access_enabled = true /* can be changed to false for premium */
  minimum_tls_version           = "1.2"
  zone_redundant                = false /* can be changed to true for premium */
}

resource "azurerm_servicebus_queue" "import_products" {
  name                                    = "import_products_queue"
  namespace_id                            = azurerm_servicebus_namespace.sb.id
  status                                  = "Active" /* Default value */
  enable_partitioning                     = true /* Default value */
  lock_duration                           = "PT1M" /* ISO 8601 timespan duration, 5 min is max */
  max_size_in_megabytes                   = 1024 /* Default value */
  max_delivery_count                      = 10 /* Default value */
  requires_duplicate_detection            = false
  duplicate_detection_history_time_window = "PT10M" /* ISO 8601 timespan duration, 5 min is max */
  requires_session                        = false
  dead_lettering_on_message_expiration    = false
}