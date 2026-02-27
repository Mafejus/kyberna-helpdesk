"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProjectorService, Projector } from "@/services/projector.service";
import { ProjectorsTable } from "@/components/projectors/ProjectorsTable";
import { ProjectorFormDialog } from "@/components/projectors/ProjectorFormDialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

export default function ProjectorsPage() {
  const { user } = useAuth();
  const [projectors, setProjectors] = useState<Projector[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProjector, setEditingProjector] = useState<Projector | null>(null);

  const canManage = user?.role === "ADMIN" || user?.role === "STUDENT";

  const fetchProjectors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ProjectorService.getAll();
      setProjectors(data);
    } catch (err) {
      console.error("Failed to load projectors", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectors();
  }, [fetchProjectors]);

  const handleEdit = (projector: Projector) => {
    setEditingProjector(projector);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu chcete smazat tento projektor?")) return;
    try {
      await ProjectorService.remove(id);
      await fetchProjectors();
    } catch (err) {
      console.error("Failed to delete projector", err);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingProjector(null);
  };

  const handleSaved = () => {
    handleDialogClose();
    fetchProjectors();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Projektory a Vybavení</h1>
          <p className="text-muted-foreground">Evidence školních projektorů a kateder</p>
        </div>
        {canManage && (
          <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Přidat projektor
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ProjectorsTable
          projectors={projectors}
          canManage={canManage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {canManage && (
        <ProjectorFormDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          projector={editingProjector}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
