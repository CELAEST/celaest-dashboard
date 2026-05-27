import json

keys = [
    "overview", "invoices", "orders", "subscriptions", "payment_methods", "financial_center", "secure_billing_management",
    "total_revenue", "vs_last_month", "active_subscriptions", "pending_refunds", "mrr_title", "recent_activity", "view_all",
    "products_assets", "subscription_plans", "master_repository", "critical_failures", "failed_payments", "no_alerts_require_intervention",
    "add_method", "add_payment_method", "add_payment_method_desc", "card_number", "cardholder_name", "clear_queue", "close", "confirm",
    "count_invoices", "create_plan", "create_product", "current_status", "customer", "customer_view", "cvv", "date", "decline",
    "delete", "delete_forever", "delete_order", "description", "digital_product", "dismiss", "download_invoice", "download_invoices",
    "edit_order", "edit_payment_method", "edit_payment_method_desc", "email", "encrypted_secure", "eom_projection", "financial", "free",
    "goal", "invoice_download_error", "invoice_header", "invoice_history", "invoice_marked_paid", "invoice_voided", "irreversible_action",
    "licenses", "live", "load_error", "manage", "mark_paid_failed", "month", "monthly", "no_billing_history", "no_events_recorded",
    "no_global_products_found", "no_invoices", "no_payment_methods", "no_plan", "no_plans_found", "organization", "owners_only", "paid",
    "payment", "payment_cancelled", "payment_method", "paypal_gateway", "per_month", "plan_active_shortly", "plan_name", "plan_now_active",
    "processing", "product", "product_name", "purchase_pending", "purchase_recorded", "queue_clear", "refund_order", "refund_reason_label",
    "refund_reason_placeholder", "refund_undone_warning", "refunds", "requests_requiring_attention", "save_changes", "save_method",
    "session_id", "showing_invoices", "showing_of_invoices", "status", "stripe_gateway", "subscription_activated", "subscription_management",
    "subscription_unchanged", "success", "syncing_alert_data", "tab", "type_label", "updating_subscription", "upgrade", "user",
    "verifying_purchase", "view_details", "view_transaction", "void_failed", "year", "yearly", "zip",
    "delete_order_warning"
]

def update_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if "billing" not in data:
        data["billing"] = {}
        
    for k in keys:
        if k not in data["billing"]:
            data["billing"][k] = k.replace("_", " ").title()

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

update_json("src/messages/en.json")
update_json("src/messages/es.json")
