import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Buildings, Users, Database, ShieldWarning, Key } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { organizationsApi } from "@/features/organizations/api/organizations.api";
import { Organization } from "@/features/organizations/types";
import { PageBanner } from "@/components/layout/PageLayout";

function useAdminOrganizations(token: string) {
  return useQuery({
    queryKey: ["admin", "organizations"],
    queryFn: () => organizationsApi.listAdmin(token),
    enabled: !!token,
  });
}

export const SuperAdminView: React.FC = () => {
  const { session } = useAuth();
  const token = session?.accessToken || "";

  const {
    data: organizations,
    isLoading: isLoadingOrgs,
    error: orgError,
  } = useAdminOrganizations(token);

  if (isLoadingOrgs) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-black/10 dark:bg-white/10 rounded-lg"></div>
        <div className="h-10 w-96 bg-black/5 dark:bg-white/5 rounded-lg mb-8"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
            />
          ))}
        </div>
      </div>
    );
  }

  if (orgError) {
    return (
      <div className="p-8 text-center bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20">
        <ShieldWarning className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-bold">
          Access Denied or Error Loading Data
        </h3>
        <p className="mt-2 text-sm opacity-80">
          Make sure your role is super_admin and the backend services are
          running.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageBanner title="Global Organizations" subtitle="Super Admin Management Console" />

      <Tabs defaultValue="organizations" className="flex-1 flex flex-col overflow-hidden px-3 pb-3 space-y-3">
        <TabsList className="bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
          <TabsTrigger
            value="organizations"
            className="flex items-center gap-2 px-6 py-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-xl transition-all font-bold uppercase tracking-widest text-[10px]"
          >
            <Buildings className="w-4 h-4" />
            Organizations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organizations?.organizations?.map((org: Organization) => (
              <Card
                key={org.id}
                className="overflow-hidden border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl hover:border-cyan-500/50 transition-all group"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
                  <CardTitle className="text-lg font-black uppercase tracking-widest">
                    {org.name}
                  </CardTitle>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                    <Database className="w-5 h-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm py-2 border-b border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                        <Buildings className="w-3 h-3" />
                        Slug
                      </div>
                      <span className="font-mono text-cyan-600 dark:text-cyan-400 text-xs">
                        {org.slug}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm py-2 border-b border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                        <Users className="w-3 h-3" />
                        Max Users
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white text-xs">
                        {org.max_users}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm py-2">
                      <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                        <Key className="w-3 h-3" />
                        Tenant ID
                      </div>
                      <span className="font-mono text-gray-400 text-[10px] truncate max-w-[120px]">
                        {org.id}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {organizations?.organizations?.length === 0 && (
              <div className="col-span-full p-12 text-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl">
                <Buildings className="w-12 h-12 mx-auto mb-4 text-gray-400 opacity-20" />
                <h3 className="text-lg font-black uppercase tracking-widest">
                  No organizations found
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  The database is completely empty.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
