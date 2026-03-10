"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProjectorService, Equipment, EquipmentType } from "@/services/projector.service";
import { EquipmentTable } from "@/components/projectors/ProjectorsTable";
import { EquipmentFormDialog } from "@/components/projectors/ProjectorFormDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Loader2 } from "lucide-react";

const TABS: { value: EquipmentType; label: string }[] = [
  { value: "PROJECTOR", label: "Projektory" },
  { value: "HUB", label: "Hub" },
  { value: "AUDIO", label: "Audio technika" },
  { value: "ACCESS_POINT", label: "APčka" },
];

const ADD_LABELS: Record<EquipmentType, string> = {
  PROJECTOR: "Přidat projektor",
  HUB: "Přidat hub",
  AUDIO: "Přidat audio",
  ACCESS_POINT: "Přidat AP",
};

export default function EquipmentPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<EquipmentType>("PROJECTOR");
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);

  const canManage = user?.role === "ADMIN" || user?.role === "STUDENT";

  const fetchItems = useCallback(async (type: EquipmentType) => {
    try {
      setLoading(true);
      const data = await ProjectorService.getAll(type);
      setItems(data);
    } catch (err) {
      console.error("Failed to load equipment", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(activeTab);
  }, [activeTab, fetchItems]);

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
      await fetchItems(activeTab);
    } catch (err) {
      console.error("Failed to delete equipment", err);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleSaved = () => {
    handleDialogClose();
    fetchItems(activeTab);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Vybavení</h1>
          <p className="text-muted-foreground">Evidence školního vybavení</p>
        </div>
        {canManage && (
          <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> {ADD_LABELS[activeTab]}
          </Button>
        )}
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
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>

      {canManage && (
        <EquipmentFormDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          item={editingItem}
          equipmentType={activeTab}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
