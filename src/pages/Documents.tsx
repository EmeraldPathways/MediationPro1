import { useState, useEffect } from "react";
import { getAllItems } from "@/services/localDbService";
import type { Matter } from "@/types/models";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, Search, Plus, MoreHorizontal, Trash, Download, Share2, 
  Edit, FolderOpen, ChevronRight, ArrowLeft, Folder
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CreateDocumentDialog } from "@/components/dialogs/create-document-dialog";
import { EditDocumentDialog, DocumentFormValues } from "@/components/dialogs/edit-document-dialog";

// Define types for better type checking
interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  createdAt: string;
  caseFileNumber: string; // Changed from matter to caseFileNumber
  owner: string;
  parentId: number | null; // Added to link documents to folders
}

interface Folder {
  id: number;
  name: string;
  type: "folder";
  parentId: number | null;
  path: string[];
}

// Define a type for items that can be in the file system
type FileSystemItem = Document | Folder;

// Mock data for documents
const initialDocuments: Document[] = [
  {
    id: 1,
    name: "Smith vs. Johnson Agreement.pdf",
    type: "pdf",
    size: "1.2 MB",
    createdAt: "2023-06-15",
    caseFileNumber: "CF-2023-001", // Updated from matter
    owner: "John Smith",
    parentId: 6 // Inside "Case Files/Smith vs. Johnson/Agreements"
  },
  {
    id: 2,
    name: "Property Dispute Resolution Notes.docx",
    type: "docx",
    size: "0.8 MB",
    createdAt: "2023-06-12",
    caseFileNumber: "CF-2023-002", // Updated from matter
    owner: "Sarah Johnson",
    parentId: 5 // Inside "Case Files/Property Dispute"
  },
  {
    id: 3,
    name: "Brown Employment Contract.pdf",
    type: "pdf",
    size: "2.5 MB",
    createdAt: "2023-06-10",
    caseFileNumber: "CF-2023-003", // Updated from matter
    owner: "Robert Brown",
    parentId: null // In root
  },
  {
    id: 4,
    name: "Mediation Guidelines.pdf",
    type: "pdf",
    size: "0.5 MB",
    createdAt: "2023-06-05",
    caseFileNumber: "General", // Keeping as string for non-case specific docs
    owner: "Andrew Rooney",
    parentId: 3 // Inside "Templates"
  },
  {
    id: 5,
    name: "Billing Records May 2023.xlsx",
    type: "xlsx",
    size: "1.8 MB",
    createdAt: "2023-06-01",
    caseFileNumber: "Administrative", // Keeping as string for non-case specific docs
    owner: "Andrew Rooney",
    parentId: 2 // Inside "Administrative"
  }
];

// Mock data for folders
const initialFolders: Folder[] = [
  {
    id: 1,
    name: "Case Files",
    type: "folder",
    parentId: null,
    path: ["Case Files"]
  },
  {
    id: 2,
    name: "Administrative",
    type: "folder",
    parentId: null,
    path: ["Administrative"]
  },
  {
    id: 4,
    name: "Smith vs. Johnson",
    type: "folder",
    parentId: 1,
    path: ["Case Files", "Smith vs. Johnson"]
  },
  {
    id: 5,
    name: "Property Dispute",
    type: "folder",
    parentId: 1,
    path: ["Case Files", "Property Dispute"]
  },
  {
    id: 6,
    name: "Agreements",
    type: "folder",
    parentId: 4,
    path: ["Case Files", "Smith vs. Johnson", "Agreements"]
  },
  {
    id: 7,
    name: "Notes",
    type: "folder",
    parentId: 4,
    path: ["Case Files", "Smith vs. Johnson", "Notes"]
  }
];

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>(
    initialFolders.filter(f => f.name !== "Templates")
  );
  const [matters, setMatters] = useState<Matter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [itemToRename, setItemToRename] = useState<{id: number, name: string, type: "document" | "folder"} | null>(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedMatters, loadedDocuments] = await Promise.all([
          getAllItems('matters'),
          getAllItems('documents'),
        ]);
        setMatters(loadedMatters);
        setDocuments(loadedDocuments);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };
    loadData();
  }, []);

  // Get folders and documents in the current directory
  let currentFolders = folders.filter(folder =>
    folder.parentId === (currentFolder ? currentFolder.id : null)
  );

  // Deduplicate folder names in Home view
  if (!currentFolder) {
    const seen = new Set<string>();
    currentFolders = currentFolders.filter(folder => {
      if (seen.has(folder.name)) return false;
      seen.add(folder.name);
      return true;
    });
  }
  
  const breadcrumbs = currentFolder ? currentFolder.path : [];
  
  // Get documents for the current folder (or root if no folder selected)
  const currentDocuments = documents.filter(doc =>
    doc.parentId === (currentFolder ? currentFolder.id : null)
  );
  
  // Combined and filtered list for the view
  const filteredItems: FileSystemItem[] = [...currentFolders, ...currentDocuments]
    .filter(item => 
      searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Handle document deletion
  const handleDeleteDocument = (id: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.success("Document deleted successfully");
  };
  
  // Handle folder deletion
  const handleDeleteFolder = (id: number) => {
    // Get all descendants of this folder
    const descendantIds = getAllDescendantIds(id);
    
    // Remove this folder and all descendants
    setFolders(prev => prev.filter(folder => 
      folder.id !== id && !descendantIds.includes(folder.id)
    ));
    
    toast.success("Folder and its contents deleted successfully");
  };
  
  // Helper to get all descendants of a folder
  const getAllDescendantIds = (folderId: number): number[] => {
    const directChildren = folders.filter(f => f.parentId === folderId);
    const descendantIds: number[] = directChildren.map(f => f.id);
    
    directChildren.forEach(child => {
      const childDescendants = getAllDescendantIds(child.id);
      descendantIds.push(...childDescendants);
    });
    
    return descendantIds;
  };

  // Handle navigation to a folder
  const handleOpenFolder = (folder: Folder) => {
    setCurrentFolder(folder);
  };
  
  // Handle navigation to parent folder
  const handleNavigateUp = () => {
    if (!currentFolder) return;
    if (currentFolder.parentId === null) {
      setCurrentFolder(null);
    } else {
      const parentFolder = folders.find(f => f.id === currentFolder.parentId);
      if (parentFolder) setCurrentFolder(parentFolder);
    }
  };
  
  // Handle navigation via breadcrumbs
  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setCurrentFolder(null);
      return;
    }
    
    if (!currentFolder) return;
    
    const path = currentFolder.path.slice(0, index);
    const targetFolder = folders.find(f => 
      f.path.length === path.length && 
      f.path.every((segment, i) => segment === path[i])
    );
    
    if (targetFolder) setCurrentFolder(targetFolder);
  };
  
  // Handle creating a new folder
  const handleCreateFolder = () => {
    // Prevent creating nested Templates folders
    const defaultName = "New Folder";
    const newFolderName = defaultName;

    const newFolder: Folder = {
      id: Math.max(...folders.map(f => f.id)) + 1,
      name: newFolderName,
      type: "folder",
      parentId: currentFolder ? currentFolder.id : null,
      path: currentFolder ? [...currentFolder.path, newFolderName] : [newFolderName]
    };

    setFolders(prev => {
      // Block adding a nested Templates folder
      if (
        newFolder.name.toLowerCase() === "templates" &&
        newFolder.parentId !== null
      ) {
        toast.error("Cannot create Templates folder inside another folder.");
        return prev;
      }
      return [...prev, newFolder];
    });

    // Start renaming the new folder immediately
    setItemToRename({
      id: newFolder.id,
      name: newFolder.name,
      type: "folder"
    });
    setNewName(newFolder.name);
    setIsRenaming(true);
  };
  
  // Start renaming an item
  const startRenaming = (id: number, name: string, type: "document" | "folder") => {
    setItemToRename({ id, name, type });
    setNewName(name);
    setIsRenaming(true);
  };
  
  // Handle renaming an item
  const handleRename = () => {
    if (!itemToRename) return;
    
    if (itemToRename.type === "folder") {
      const folderToRename = folders.find(f => f.id === itemToRename.id);
      if (!folderToRename) return;
      
      // Update the folder and all its descendants' paths
      setFolders(prev => prev.map(folder => {
        if (folder.id === itemToRename.id) {
          const newPath = [...folder.path.slice(0, -1), newName];
          return { ...folder, name: newName, path: newPath };
        }
        
        // Update descendants paths
        if (folder.path.slice(0, folderToRename.path.length).every((segment, i) => segment === folderToRename.path[i])) {
          const restOfPath = folder.path.slice(folderToRename.path.length);
          const newPath = [...folderToRename.path.slice(0, -1), newName, ...restOfPath];
          return { ...folder, path: newPath };
        }
        
        return folder;
      }));
    } else {
      // Rename document
      setDocuments(prev => prev.map(doc => 
        doc.id === itemToRename.id ? { ...doc, name: newName } : doc
      ));
    }
    
    setIsRenaming(false);
    setItemToRename(null);
    setNewName("");
    
    toast.success("Item renamed successfully");
  };

  // Handle document save
  const handleSaveDocument = (updatedDoc: DocumentFormValues) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === updatedDoc.id 
          ? { ...doc, ...updatedDoc } 
          : doc
      )
    );
    toast.success("Document updated successfully");
  };

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "xlsx":
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Type guard to check if an item is a Document
  const isDocument = (item: FileSystemItem): item is Document => {
    return 'createdAt' in item && 'size' in item;
  };

  // Type guard to check if an item is a Folder
  const isFolder = (item: FileSystemItem): item is Folder => {
    return item.type === 'folder';
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              Manage and organize all your case documents
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCreateFolder}
            >
              <Folder className="mr-2 h-4 w-4" />
              New Folder
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload-input')?.click()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
            <input
              id="file-upload-input"
              type="file"
              multiple
              className="hidden"
              onChange={async (e) => {
                const files = e.target.files;
                if (!files) return;
                const newDocs: Document[] = [];
                for (const file of Array.from(files)) {
                  const newDoc: Document = {
                    id: Math.max(0, ...documents.map(d => d.id)) + 1 + newDocs.length,
                    name: file.name,
                    type: file.type || 'file',
                    size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                    createdAt: new Date().toISOString(),
                    caseFileNumber: '',
                    owner: 'You',
                    parentId: currentFolder ? currentFolder.id : null,
                  };
                  try {
                    await addItem('documents', newDoc);
                    console.log("Saved document to IndexedDB:", newDoc);
                  } catch (error) {
                    console.error("Failed to save document", error);
                  }
                  newDocs.push(newDoc);
                }
                try {
                  const updatedDocs = await getAllItems('documents');
                  setDocuments(updatedDocs);
                } catch (error) {
                  console.error("Failed to reload documents after upload", error);
                  setDocuments(prev => [...prev, ...newDocs]);
                }
                e.target.value = '';
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full bg-background py-2 pl-8 pr-4 text-sm border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Breadcrumb navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => handleBreadcrumbClick(0)}
            >
              Home
            </Button>

            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => handleBreadcrumbClick(index + 1)}
                  disabled={index === breadcrumbs.length - 1}
                >
                  {crumb}
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={handleNavigateUp}
            disabled={!currentFolder}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px divide-y md:divide-y-0 md:divide-x border rounded-md overflow-hidden">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => {
                        if (isFolder(item)) {
                          handleOpenFolder(item);
                        }
                      }}
                    >
                      {isFolder(item) ? (
                        <FolderOpen className="h-5 w-5 text-amber-500" />
                      ) : (
                        getFileIcon(item.type)
                      )}
                      
                      <div className="ml-3">
                        <p className="text-sm font-medium flex flex-wrap items-center gap-2">
                          {item.name}
                          {isFolder(item) && item.parentId === 1 && (() => {
                            // This is a top-level case folder under "Case Files"
                            const doc = documents.find(d => d.parentId === item.id || d.parentId && folders.find(f => f.id === d.parentId)?.parentId === item.id);
                            if (!doc?.caseFileNumber) return null;
                            const matter = matters.find(m => m.caseFileNumber === doc.caseFileNumber);
                            return matter ? (
                              <a
                                href={`/case-files/${matter.id}`}
                                className="text-blue-600 hover:underline font-mono text-xs"
                                title={`View Case File ${doc.caseFileNumber}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {doc.caseFileNumber}
                              </a>
                            ) : null;
                          })()}
                        </p>
                        {isDocument(item) && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <span>{formatDate(item.createdAt)}</span>
                            <span className="mx-2">•</span>
                            <span>{item.size}</span>
                            <span className="mx-2">•</span>
                            {/* Display caseFileNumber instead of matter */}
                            <span>{item.caseFileNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:mt-0 flex items-center ml-8 sm:ml-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="flex gap-2 p-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startRenaming(
                              item.id,
                              item.name,
                              isFolder(item) ? 'folder' : 'document'
                            )}
                            title="Rename"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {isDocument(item) && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  // Implement download logic here
                                }}
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  // Implement share logic here
                                }}
                                title="Share"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                title="Delete"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete {item.name}.
                                  {isFolder(item) && " This will also delete all contents of the folder."}
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => {
                                    if (isFolder(item)) {
                                      handleDeleteFolder(item.id);
                                    } else {
                                      handleDeleteDocument(item.id);
                                    }
                                  }}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <p>No documents found in this location.</p>
                  <div className="flex justify-center gap-2 mt-2">
                    <Button 
                      variant="outline"
                      onClick={handleCreateFolder}
                    >
                      <Folder className="mr-2 h-4 w-4" />
                      New Folder
                    </Button>
                    <CreateDocumentDialog />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Rename Dialog */}
        <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rename {itemToRename?.type === 'folder' ? 'Folder' : 'Document'}</DialogTitle>
              <DialogDescription>
                Enter a new name for this {itemToRename?.type === 'folder' ? 'folder' : 'document'}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsRenaming(false);
                  setItemToRename(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleRename}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default DocumentsPage;
