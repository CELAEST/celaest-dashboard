import json

new_en = {
    "most_popular": "Most Popular",
    "per_mo": "/mo",
    "yr": "yr",
    "save": "save",
    "unlimited": "Unlimited",
    "ai_req": "AI Req",
    "members": "Members",
    "storage": "Storage",
    "active_plan": "Active Plan",
    "get_started": "Get Started",
    "choose_plan": "Choose Plan",
}

new_es = {
    "most_popular": "Más Popular",
    "per_mo": "/mes",
    "yr": "año",
    "save": "ahorra",
    "unlimited": "Ilimitado",
    "ai_req": "Sol. IA",
    "members": "Miembros",
    "storage": "Almacenamiento",
    "active_plan": "Plan Activo",
    "get_started": "Comenzar",
    "choose_plan": "Elegir Plan",
}

for filepath, keys in [("src/messages/en.json", new_en), ("src/messages/es.json", new_es)]:
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    for k, v in keys.items():
        data["billing"][k] = v
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

print("Done - PlanCard keys injected.")
