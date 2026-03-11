"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ProjectorService, Equipment, EquipmentType, EquipmentPropertyDef } from "@/services/projector.service";
import { EquipmentTable } from "@/components/projectors/ProjectorsTable";
import { EquipmentFormDialog } from "@/components/projectors/ProjectorFormDialog";
import { EquipmentPropertyManager } from "@/components/projectors/EquipmentPropertyManager";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Loader2 } from "lucide-react";

const TABS: { value: EquipmentType; label: string }[] = [
  { value: "PROJECTOR", label: "Projektory" },
  { value: "HUB", label: "Hub" },
  { value: "AUDIO", label: "Audio technika" },
  { value: "ACCESS_POINT", label: "APčka" },
  { value: "OTHER", label: "Ostatní" },
];

const ADD_LABELS: Record<EquipmentType, string> = {
  PROJECTOR: "Přidat projektor",
  HUB: "Přidat hub",
  AUDIO: "Přidat audio",
  ACCESS_POINT: "Přidat AP",
  OTHER: "Přidat vybavení",
};

export default function EquipmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EquipmentType>("PROJECTOR");
  const [items, setItems] = useState<Equipment[]>([]);
  const [properties, setProperties] = useState<EquipmentPropertyDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);

  // Only ADMIN and STUDENT can access this page
  useEffect(() => {
    if (user && user.role !== "ADMIN" && user.role !== "STUDENT") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const canManage = user?.role === "ADMIN" || user?.role === "STUDENT";

  const fetchData = useCallback(async (type: EquipmentType) => {
    try {
      setLoading(true);
      const [itemsData, propsData] = await Promise.all([
        ProjectorService.getAll(type),
        ProjectorService.getProperties(type),
      ]);
      setItems(itemsData);
      setProperties(propsData);
    } catch (err) {
      console.error("Failed to load equipment", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canManage) fetchData(activeTab);
  }, [activeTab, fetchData, canManage]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as EquipmentType);
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: Equipment) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu chcete smazat toto vybavení?")) return;
    try {
      await ProjectorService.remove(id);
      await fetchData(activeTab);
    } catch (err) {
      console.error("Failed to delete equipment", err);
    }
  };

  const handleUpdateValue = async (
    equipmentId: string,
    propertyId: string,
    valueBool?: boolean,
    valueText?: string,
  ) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== equipmentId) return item;
        const existingIdx = item.propertyValues.findIndex((v) => v.propertyId === propertyId);
        const newValues = [...item.propertyValues];
        const prop = properties.find((p) => p.id === propertyId);
        if (!prop) return item;

        if (existingIdx > -1) {
          newValues[existingIdx] = {
            ...newValues[existingIdx],
            valueBool: valueBool ?? null,
            valueText: valueText ?? null,
          };
        } else {
          newValues.push({
            id: "temp",
            equipmentId,
            propertyId,
            valueBool: valueBool ?? null,
            valueText: valueText ?? null,
            property: prop,
          });
        }
        return { ...item, propertyValues: newValues };
      }),
    );

    try {
      await ProjectorService.updateValues(equipmentId, [{ propertyId, valueBool, valueText }]);
    } catch (err) {
      console.error("Failed to update value", err);
      fetchData(activeTab); // revert on error
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleSaved = () => {
    handleDialogClose();
    fetchData(activeTab);
  };

  const handlePropertiesChanged = () => {
    fetchData(activeTab);
  };

  // Render nothing while redirecting non-authorized users
  if (!user || (user.role !== "ADMIN" && user.role !== "STUDENT")) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Vybavení</h1>
          <p className="text-muted-foreground">Evidence školního vybavení</p>
        </div>
        <div className="flex gap-2">
          <EquipmentPropertyManager
            equipmentType={activeTab}
            properties={properties}
            onChanged={handlePropertiesChanged}
          />
          <Button onClick={() => setDialogOpen(true)} className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" /> {ADD_LABELS[activeTab]}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full sm:w-auto">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <EquipmentTable
                items={items}
                equipmentType={tab.value}
                canManage={canManage}
                properties={properties}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdateValue={handleUpdateValue}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>

      <EquipmentFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        item={editingItem}
        equipmentType={activeTab}
        onSaved={handleSaved}
      />
    </div>
  );
}
