import { useState, useCallback } from "react";

const useDeleteDialog = (onConfirm: (id: string) => void) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDeleteClick = useCallback((id: string) => {
        setDeleteId(id);
        setDeleteDialogOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        if (deleteId) {
            onConfirm(deleteId);
            setDeleteDialogOpen(false);
            setDeleteId(null);
        }
    }, [deleteId, onConfirm]);

    return { deleteDialogOpen, setDeleteDialogOpen, handleDeleteClick, handleDeleteConfirm };
};

export default useDeleteDialog;
