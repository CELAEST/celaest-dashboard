import json

new_keys_en = {
    # TransactionLogsModal
    "date_and_time": "Date & Time",
    "organization_id": "Organization ID",
    "details": "Details",
    "transaction_logs": "Transaction Logs",
    "total_processed": "Total processed: {count} records",
    "search_transactions": "Search transactions...",
    "filter": "Filter",
    "export": "Export",
    "no_transactions_found": "No transactions found",
    "transaction_history_will_appear": "Transaction history will appear here.",
    # UpgradePlanModal
    "choose_your_plan": "Choose Your Plan",
    "scale_your_business": "Scale your business with the right plan",
    "org_session_missing": "Organization or session information missing",
    "redirecting_to_stripe": "Redirecting to Stripe for payment...",
    "plan_activated": "Successfully activated {name} plan!",
    "plan_already_active": "{name} plan is already active!",
    "upgrade_failed": "Failed to upgrade plan",
    # ManageSubscription
    "manage_subscription": "Manage Subscription",
    "update_subscription_settings": "Update your subscription settings",
    "done": "Done",
    "pause_subscription": "Pause Subscription",
    "temporarily_pause_billing": "Temporarily pause billing",
    "cancel_subscription": "Cancel Subscription",
    "end_your_subscription": "End your subscription",
    # ConfigurePaymentGateways
    "payment_gateways": "Payment Gateways",
    "manage_api_keys": "Manage API keys & settings",
    "changes_saved_auto": "Changes are saved automatically",
    "sandbox": "Sandbox",
    "configure": "Configure",
    "api_key_secret": "API Key / Secret",
    "enter_api_key": "Enter API key or secret",
    "webhook_url": "Webhook URL",
    "test_mode": "Test Mode",
    "enable_test_mode": "Enable test mode for development and testing",
    "save_configuration": "Save Configuration",
    "api_credentials": "API Credentials",
    "endpoint_url": "Endpoint URL",
}

new_keys_es = {
    # TransactionLogsModal
    "date_and_time": "Fecha y Hora",
    "organization_id": "ID de Organización",
    "details": "Detalles",
    "transaction_logs": "Registro de Transacciones",
    "total_processed": "Total procesado: {count} registros",
    "search_transactions": "Buscar transacciones...",
    "filter": "Filtrar",
    "export": "Exportar",
    "no_transactions_found": "No se encontraron transacciones",
    "transaction_history_will_appear": "El historial de transacciones aparecerá aquí.",
    # UpgradePlanModal
    "choose_your_plan": "Elige Tu Plan",
    "scale_your_business": "Escala tu negocio con el plan adecuado",
    "org_session_missing": "Falta información de organización o sesión",
    "redirecting_to_stripe": "Redirigiendo a Stripe para el pago...",
    "plan_activated": "¡Plan {name} activado exitosamente!",
    "plan_already_active": "¡El plan {name} ya está activo!",
    "upgrade_failed": "Error al actualizar el plan",
    # ManageSubscription
    "manage_subscription": "Gestionar Suscripción",
    "update_subscription_settings": "Actualiza la configuración de tu suscripción",
    "done": "Listo",
    "pause_subscription": "Pausar Suscripción",
    "temporarily_pause_billing": "Pausar facturación temporalmente",
    "cancel_subscription": "Cancelar Suscripción",
    "end_your_subscription": "Terminar tu suscripción",
    # ConfigurePaymentGateways
    "payment_gateways": "Pasarelas de Pago",
    "manage_api_keys": "Gestionar claves API y configuración",
    "changes_saved_auto": "Los cambios se guardan automáticamente",
    "sandbox": "Sandbox",
    "configure": "Configurar",
    "api_key_secret": "Clave API / Secreto",
    "enter_api_key": "Ingresa la clave API o secreto",
    "webhook_url": "URL de Webhook",
    "test_mode": "Modo de Prueba",
    "enable_test_mode": "Habilitar modo de prueba para desarrollo",
    "save_configuration": "Guardar Configuración",
    "api_credentials": "Credenciales API",
    "endpoint_url": "URL del Endpoint",
}

for filepath, keys in [("src/messages/en.json", new_keys_en), ("src/messages/es.json", new_keys_es)]:
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    for k, v in keys.items():
        if k not in data["billing"]:
            data["billing"][k] = v
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

print("Done - all new modal keys injected.")
