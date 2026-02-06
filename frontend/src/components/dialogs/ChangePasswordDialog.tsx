"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        toast({ title: "Hesla se neshodují", variant: "destructive" });
        return;
    }
    if (newPassword.length < 6) {
        toast({ title: "Heslo musí mít alespoň 6 znaků", variant: "destructive" });
        return;
    }

    setLoading(true);
    try {
        await api.patch('/users/me/password', {
            currentPassword,
            newPassword
        });

        toast({ title: "Heslo změněno", description: "Byli jste odhlášeni." });
        onOpenChange(false);
        logout();
    } catch (err) {
        toast({ title: "Chyba", description: "Špatné stávající heslo nebo chyba serveru.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Změnit heslo</DialogTitle>
          <DialogDescription>
            Zadejte své stávající heslo a nové heslo. Po změně budete odhlášeni.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current" className="text-right">
                Současné
                </Label>
                <Input
                id="current"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="col-span-3"
                required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new" className="text-right">
                Nové
                </Label>
                <Input
                id="new"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
                required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm" className="text-right">
                Potvrzení
                </Label>
                <Input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="col-span-3"
                required
                />
            </div>
            </div>
            <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? 'Ukládám...' : 'Změnit heslo'}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
