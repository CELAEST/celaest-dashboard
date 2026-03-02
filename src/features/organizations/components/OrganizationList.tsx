import React from "react";
import { useOrganizations } from "../hooks/useOrganizations";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Building2, Users, Settings, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Organization } from "../types";

export const OrganizationList: React.FC = () => {
  const { session } = useAuth();
  const token = session?.accessToken || "";
  const { data: organizations, isLoading, error } = useOrganizations(token);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-9 w-48 bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-64 bg-muted/60 animate-pulse rounded-md" />
          </div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="bg-card/40 border-border/40 overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="h-5 w-32 bg-muted animate-pulse rounded-md" />
                <div className="w-5 h-5 bg-muted animate-pulse rounded-md" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 w-40 bg-muted/60 animate-pulse rounded-md" />
                  <div className="h-9 w-full bg-muted/40 animate-pulse rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
        Error al cargar organizaciones. Por favor, intente de nuevo.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organizaciones</h2>
          <p className="text-muted-foreground">
            Administre sus tenants y configuraciones empresariales.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Organización
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {organizations?.map((org: Organization) => (
          <Card
            key={org.id}
            className="overflow-hidden border-border/40 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all cursor-pointer group"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-bold">{org.name}</CardTitle>
              <Building2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Máximo {org.max_users} usuarios</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Configuración
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {organizations?.length === 0 && (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-border/40 rounded-xl">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-medium">No hay organizaciones</h3>
            <p className="text-muted-foreground">
              Comience creando su primer tenant para habilitar la colaboración.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
