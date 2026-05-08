import json

missing_en = {
    "Active": "Active",
    "Cancelled": "Cancelled",
    "Completed": "Completed",
    "Failed": "Failed",
    "Pending": "Pending",
    "Processing": "Processing",
    "actions": "Actions",
    "address": "Address",
    "admin_action_required": "Admin Action Required",
    "admin_view": "Admin View",
    "all_invoices": "All Invoices",
    "all_time": "All Time",
    "amount": "Amount",
    "api_calls": "API Calls",
    "approve": "Approve",
    "archived": "Archived",
    "arpu": "ARPU",
    "available": "Available",
    "avg_mo": "Avg/mo",
    "bank_level_security": "Bank-Level Security",
    "bank_level_security_desc": "Your payment data is protected with industry-standard encryption",
    "billing_information": "Billing Information",
    "billing_portal": "Billing Portal",
    "cap": "Cap",
    "card_information": "Card Information",
    "catalog": "Catalog",
    "category": "Category",
    "churn_rate": "Churn Rate",
    "city": "City",
    "code": "Code",
    "controls": "Controls",
}

missing_es = {
    "Active": "Activo",
    "Cancelled": "Cancelado",
    "Completed": "Completado",
    "Failed": "Fallido",
    "Pending": "Pendiente",
    "Processing": "Procesando",
    "actions": "Acciones",
    "address": "Dirección",
    "admin_action_required": "Acción de Admin Requerida",
    "admin_view": "Vista de Admin",
    "all_invoices": "Todas las Facturas",
    "all_time": "Todo el Tiempo",
    "amount": "Monto",
    "api_calls": "Llamadas API",
    "approve": "Aprobar",
    "archived": "Archivado",
    "arpu": "ARPU",
    "available": "Disponible",
    "avg_mo": "Prom/mes",
    "bank_level_security": "Seguridad Bancaria",
    "bank_level_security_desc": "Tus datos de pago están protegidos con cifrado estándar de la industria",
    "billing_information": "Información de Facturación",
    "billing_portal": "Portal de Facturación",
    "cap": "Límite",
    "card_information": "Información de Tarjeta",
    "catalog": "Catálogo",
    "category": "Categoría",
    "churn_rate": "Tasa de Abandono",
    "city": "Ciudad",
    "code": "Código",
    "controls": "Controles",
}

# Also fix licensing
lic_en = {"license_key": "License Key"}
lic_es = {"license_key": "Clave de Licencia"}

for filepath, billing_vals, lic_vals in [
    ("src/messages/en.json", missing_en, lic_en),
    ("src/messages/es.json", missing_es, lic_es),
]:
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for k, v in billing_vals.items():
        data["billing"][k] = v
    for k, v in lic_vals.items():
        data["licensing"][k] = v
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

print("Done. Injected all missing keys.")
