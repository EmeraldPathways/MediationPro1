import { useState, useEffect } from "react";
import { getAllItems } from "@/services/localDbService";
import type { Matter } from "@/types/models";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, Search, Plus, MoreHorizontal, Trash, Download, Share2, 
  Edit, FolderOpen, ChevronRight, ArrowLeft, Folder, Files,
  File, FilePlus2
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadData = async () => {
      try {
        let loadedMatters: Matter[] = [];
        let loadedDocuments: Document[] = [];
        
        try {
          [loadedMatters, loadedDocuments] = await Promise.all([
            getAllItems('matters'),
            getAllItems('documents'),
          ]);
        } catch (error) {
          console.error("Failed to load data from local DB", error);
          loadedDocuments = initialDocuments;
        }
        
        if (loadedDocuments.length === 0) {
          loadedDocuments = initialDocuments;
        }
        
        setMatters(loadedMatters);
        setDocuments(loadedDocuments);
      } catch (error) {
        console.error("Failed to load data", error);
        setDocuments(initialDocuments);
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
  
  // Filter based on active tab
  const getFilteredDocuments = () => {
    const documentsInCurrentLocation = documents.filter(doc =>
      doc.parentId === (currentFolder ? currentFolder.id : null)
    );
    
    // Filter by type if needed
    if (activeTab === "all") {
      return documentsInCurrentLocation;
    } else {
      return documentsInCurrentLocation.filter(doc => doc.type.toLowerCase() === activeTab);
    }
  };
  
  // Get documents count by type
  const pdfCount = documents.filter(doc => doc.type.toLowerCase() === "pdf").length;
  const docxCount = documents.filter(doc => doc.type.toLowerCase() === "docx").length;
  const xlsxCount = documents.filter(doc => doc.type.toLowerCase() === "xlsx").length;
  
  // Combined and filtered list for the view
  const filteredItems: FileSystemItem[] = [...currentFolders, ...getFilteredDocuments()]
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
  
  const getTabTitle = () => {
    if (currentFolder) {
      return currentFolder.name;
    }
    
    switch(activeTab) {
      case "pdf": return "PDF Documents";
      case "docx": return "Word Documents";
      case "xlsx": return "Excel Documents";
      default: return "All Documents";
    }
  };

  return (
    <Layout>
      <div className={`flex flex-col h-full ${isMobile ? "space-y-4" : "space-y-6"}`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h1 className={`${isMobile ? "text-xl" : "text-3xl"} font-bold tracking-tight`}>Documents</h1>
            <p className="text-muted-foreground text-sm">
              Manage and organize all your case documents
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={handleCreateFolder}
              className="flex items-center gap-2"
            >
              <Folder className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              New Folder
            </Button>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={() => document.getElementById('file-upload-input')?.click()}
              className="flex items-center gap-2"
            >
              <Plus className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              Upload
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
                  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
                  const fileType = fileExt === 'pdf' ? 'pdf' : 
                                  (fileExt === 'docx' || fileExt === 'doc') ? 'docx' : 
                                  (fileExt === 'xlsx' || fileExt === 'xls') ? 'xlsx' : 'file';
                  
                  const newDoc: Document = {
                    id: Math.max(0, ...documents.map(d => d.id)) + 1 + newDocs.length,
                    name: file.name,
                    type: fileType,
                    size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                    createdAt: new Date().toISOString().split('T')[0],
                    caseFileNumber: currentFolder?.name || 'General',
                    owner: 'You',
                    parentId: currentFolder ? currentFolder.id : null,
                  };
                  newDocs.push(newDoc);
                }
                
                setDocuments(prev => [...prev, ...newDocs]);
                toast.success(`${newDocs.length} document${newDocs.length !== 1 ? 's' : ''} uploaded successfully`);
                e.target.value = '';
              }}
            />
            <Button
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-2"
            >
              <FilePlus2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              New Document
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className={`pb-2 ${isMobile ? "p-3" : ""}`}>
              <CardTitle className="text-sm font-medium">PDF Files</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-3 pt-0" : ""}>
              <div className="flex items-center justify-between">
                <div className={`${isMobile ? "text-lg" : "text-2xl"} font-bold`}>{pdfCount}</div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveTab("pdf")}
                >View</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className={`pb-2 ${isMobile ? "p-3" : ""}`}>
              <CardTitle className="text-sm font-medium">Word Documents</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-3 pt-0" : ""}>
              <div className="flex items-center justify-between">
                <div className={`${isMobile ? "text-lg" : "text-2xl"} font-bold`}>{docxCount}</div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveTab("docx")}
                >View</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className={`pb-2 ${isMobile ? "p-3" : ""}`}>
              <CardTitle className="text-sm font-medium">Excel Sheets</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-3 pt-0" : ""}>
              <div className="flex items-center justify-between">
                <div className={`${isMobile ? "text-lg" : "text-2xl"} font-bold`}>{xlsxCount}</div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveTab("xlsx")}
                >View</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-[calc(100vh-380px)] flex flex-col overflow-hidden">
          <CardHeader className={`${isMobile ? "px-2 py-2" : "pb-0"}`}>
            <div className="flex justify-between items-center">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className={`grid grid-cols-4 ${isMobile ? "w-full text-xs" : "w-[400px]"}`}>
                  <TabsTrigger value="all" className="flex items-center gap-1">
                    <Files className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                    All
                  </TabsTrigger>
                  <TabsTrigger value="pdf" className="flex items-center gap-1">
                    <FileText className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} text-red-500`} />
                    PDF
                  </TabsTrigger>
                  <TabsTrigger value="docx" className="flex items-center gap-1">
                    <FileText className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} text-blue-500`} />
                    Word
                  </TabsTrigger>
                  <TabsTrigger value="xlsx" className="flex items-center gap-1">
                    <FileText className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} text-green-500`} />
                    Excel
                  </TabsTrigger>
                </TabsList>
                
                <div className={`flex flex-col ${isMobile ? "gap-2" : "gap-0"} sm:flex-row sm:justify-between sm:items-center ${isMobile ? "mt-2 mb-1" : "mt-4 mb-2"}`}>
                  <CardTitle className={isMobile ? "text-base" : ""}>{getTabTitle()}</CardTitle>
                  
                  <div className="flex items-center space-x-2">
                    {/* Breadcrumb navigation */}
                    {currentFolder && (
                      <div className={`flex items-center ${isMobile ? "text-xs" : ""}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`${isMobile ? "h-6 px-1" : "h-8 px-2"}`}
                          onClick={() => handleBreadcrumbClick(0)}
                        >
                          Home
                        </Button>

                        {breadcrumbs.map((crumb, index) => (
                          <div key={index} className="flex items-center">
                            <ChevronRight className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} text-muted-foreground mx-1`} />
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`${isMobile ? "h-6 px-1 text-xs" : "h-8 px-2"}`}
                              onClick={() => handleBreadcrumbClick(index + 1)}
                              disabled={index === breadcrumbs.length - 1}
                            >
                              {crumb}
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`${isMobile ? "h-6 px-1 ml-1" : "h-8 px-2 ml-2"}`}
                          onClick={handleNavigateUp}
                          disabled={!currentFolder}
                        >
                          <ArrowLeft className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
                          Up
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative flex-1 max-w-xs">
                    <Search className={`absolute left-2.5 ${isMobile ? "top-1.5 h-3 w-3" : "top-2.5 h-4 w-4"} text-muted-foreground`} />
                    <Input 
                      placeholder="Search documents..." 
                      className={`${isMobile ? "text-xs h-6 pl-7" : "pl-8"}`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <TabsContent value="all" className="m-0 overflow-hidden">
                  <CardContent className="flex-1 overflow-y-auto overflow-x-hidden p-0">
                    <div className="divide-y">
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                          <div
                            key={item.id}
                            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isMobile ? "p-2" : "p-4"} hover:bg-muted/50 transition-colors`}
                          >
                            <div 
                              className="flex items-center cursor-pointer"
                              onClick={() => {
                                if (isFolder(item)) {
                                  handleOpenFolder(item);
                                }
                              }}
                            >
                              <div className={`${isMobile ? "h-8 w-8" : "h-10 w-10"} rounded-full bg-primary/10 flex items-center justify-center text-primary`}>
                                {isFolder(item) ? (
                                  <FolderOpen className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-amber-500`} />
                                ) : (
                                  <span className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`}>
                                    {getFileIcon(item.type)}
                                  </span>
                                )}
                              </div>
                              
                              <div className="ml-3 min-w-0">
                                <p className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>
                                  {item.name}
                                  {isFolder(item) && item.parentId === 1 && (() => {
                                    // This is a top-level case folder under "Case Files"
                                    const doc = documents.find(d => d.parentId === item.id || d.parentId && folders.find(f => f.id === d.parentId)?.parentId === item.id);
                                    if (!doc?.caseFileNumber) return null;
                                    const matter = matters.find(m => m.caseFileNumber === doc.caseFileNumber);
                                    return matter ? (
                                      <a
                                        href={`/case-files/${matter.id}`}
                                        className="text-blue-600 hover:underline font-mono text-xs ml-2"
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
                                    <span className={isMobile ? "text-[0.65rem]" : ""}>{formatDate(item.createdAt)} • {item.size} • {item.caseFileNumber}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className={`${isMobile ? "mt-1 ml-11" : "mt-0"} sm:mt-0 flex items-center`}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => startRenaming(
                                      item.id,
                                      item.name,
                                      isFolder(item) ? 'folder' : 'document'
                                    )}
                                  >
                                    <Edit className="h-4 w-4 mr-2" /> Rename
                                  </DropdownMenuItem>
                                  
                                  {isDocument(item) && (
                                    <>
                                      <DropdownMenuItem onClick={() => {
                                        // Implement download logic here
                                        toast.success("Download started");
                                      }}>
                                        <Download className="h-4 w-4 mr-2" /> Download
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => {
                                        // Implement share logic here
                                        toast.success("Link copied to clipboard");
                                      }}>
                                        <Share2 className="h-4 w-4 mr-2" /> Share
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => {
                                      if (isFolder(item)) {
                                        handleDeleteFolder(item.id);
                                      } else {
                                        handleDeleteDocument(item.id);
                                      }
                                    }}
                                  >
                                    <Trash className="h-4 w-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={`${isMobile ? "p-4 text-sm" : "p-6"} text-center text-muted-foreground`}>
                          <p>No documents found in this location.</p>
                          <div className="flex justify-center gap-2 mt-2">
                            <Button 
                              variant="outline"
                              onClick={handleCreateFolder}
                              size={isMobile ? "sm" : "default"}
                            >
                              <Folder className="mr-2 h-4 w-4" />
                              New Folder
                            </Button>
                            <Button 
                              variant="default"
                              size={isMobile ? "sm" : "default"}
                              onClick={() => document.getElementById('file-upload-input')?.click()}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="pdf" className="m-0 overflow-hidden">
                  <CardContent className="flex-1 overflow-y-auto overflow-x-hidden p-0">
                    <div className="divide-y">
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item) => {
                          if (isFolder(item) || (isDocument(item) && item.type.toLowerCase() === "pdf")) {
                            return (
                              <div
                                key={item.id}
                                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isMobile ? "p-2" : "p-4"} hover:bg-muted/50 transition-colors`}
                              >
                                {/* Same item rendering as "all" tab */}
                                <div 
                                  className="flex items-center cursor-pointer"
                                  onClick={() => {
                                    if (isFolder(item)) {
                                      handleOpenFolder(item);
                                    }
                                  }}
                                >
                                  <div className={`${isMobile ? "h-8 w-8" : "h-10 w-10"} rounded-full bg-primary/10 flex items-center justify-center text-primary`}>
                                    {isFolder(item) ? (
                                      <FolderOpen className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-amber-500`} />
                                    ) : (
                                      <FileText className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-red-500`} />
                                    )}
                                  </div>
                                  
                                  <div className="ml-3 min-w-0">
                                    <p className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{item.name}</p>
                                    {isDocument(item) && (
                                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                                        <span className={isMobile ? "text-[0.65rem]" : ""}>{formatDate(item.createdAt)} • {item.size}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className={`${isMobile ? "mt-1 ml-11" : "mt-0"} sm:mt-0 flex items-center`}>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => startRenaming(
                                      item.id,
                                      item.name,
                                      isFolder(item) ? 'folder' : 'document'
                                    )}
                                    title="Rename"
                                    className="h-8 w-8"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  
                                  {isDocument(item) && (
                                    <>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        title="Download"
                                        className="h-8 w-8"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        title="Share"
                                        className="h-8 w-8"
                                      >
                                        <Share2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => {
                                      if (isFolder(item)) {
                                        handleDeleteFolder(item.id);
                                      } else {
                                        handleDeleteDocument(item.id);
                                      }
                                    }}
                                    title="Delete"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }).filter(Boolean)
                      ) : (
                        <div className={`${isMobile ? "p-4 text-sm" : "p-6"} text-center text-muted-foreground`}>
                          <p>No PDF documents found in this location.</p>
                          <div className="flex justify-center gap-2 mt-2">
                            <Button 
                              variant="outline"
                              onClick={() => document.getElementById('file-upload-input')?.click()}
                              size={isMobile ? "sm" : "default"}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Upload PDF
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="docx" className="m-0 overflow-hidden">
                  <CardContent className="flex-1 overflow-y-auto overflow-x-hidden p-0">
                    <div className="divide-y">
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item) => {
                          if (isFolder(item) || (isDocument(item) && item.type.toLowerCase() === "docx")) {
                            return (
                              <div
                                key={item.id}
                                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isMobile ? "p-2" : "p-4"} hover:bg-muted/50 transition-colors`}
                              >
                                {/* Same item rendering as "all" tab */}
                                <div 
                                  className="flex items-center cursor-pointer"
                                  onClick={() => {
                                    if (isFolder(item)) {
                                      handleOpenFolder(item);
                                    }
                                  }}
                                >
                                  <div className={`${isMobile ? "h-8 w-8" : "h-10 w-10"} rounded-full bg-primary/10 flex items-center justify-center text-primary`}>
                                    {isFolder(item) ? (
                                      <FolderOpen className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-amber-500`} />
                                    ) : (
                                      <FileText className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-blue-500`} />
                                    )}
                                  </div>
                                  
                                  <div className="ml-3 min-w-0">
                                    <p className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{item.name}</p>
                                    {isDocument(item) && (
                                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                                        <span className={isMobile ? "text-[0.65rem]" : ""}>{formatDate(item.createdAt)} • {item.size}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className={`${isMobile ? "mt-1 ml-11" : "mt-0"} sm:mt-0 flex items-center`}>
                                  {/* Same action buttons as "all" tab */}
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => startRenaming(
                                      item.id,
                                      item.name,
                                      isFolder(item) ? 'folder' : 'document'
                                    )}
                                    title="Rename"
                                    className="h-8 w-8"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  
                                  {isDocument(item) && (
                                    <>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        title="Download"
                                        className="h-8 w-8"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        title="Share"
                                        className="h-8 w-8"
                                      >
                                        <Share2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => {
                                      if (isFolder(item)) {
                                        handleDeleteFolder(item.id);
                                      } else {
                                        handleDeleteDocument(item.id);
                                      }
                                    }}
                                    title="Delete"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }).filter(Boolean)
                      ) : (
                        <div className={`${isMobile ? "p-4 text-sm" : "p-6"} text-center text-muted-foreground`}>
                          <p>No Word documents found in this location.</p>
                          <div className="flex justify-center gap-2 mt-2">
                            <Button 
                              variant="outline"
                              onClick={() => document.getElementById('file-upload-input')?.click()}
                              size={isMobile ? "sm" : "default"}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Upload Document
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="xlsx" className="m-0 overflow-hidden">
                  <CardContent className="flex-1 overflow-y-auto overflow-x-hidden p-0">
                    <div className="divide-y">
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item) => {
                          if (isFolder(item) || (isDocument(item) && item.type.toLowerCase() === "xlsx")) {
                            return (
                              <div
                                key={item.id}
                                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isMobile ? "p-2" : "p-4"} hover:bg-muted/50 transition-colors`}
                              >
                                {/* Same item rendering as "all" tab */}
                                <div 
                                  className="flex items-center cursor-pointer"
                                  onClick={() => {
                                    if (isFolder(item)) {
                                      handleOpenFolder(item);
                                    }
                                  }}
                                >
                                  <div className={`${isMobile ? "h-8 w-8" : "h-10 w-10"} rounded-full bg-primary/10 flex items-center justify-center text-primary`}>
                                    {isFolder(item) ? (
                                      <FolderOpen className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-amber-500`} />
                                    ) : (
                                      <FileText className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-green-500`} />
                                    )}
                                  </div>
                                  
                                  <div className="ml-3 min-w-0">
                                    <p className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{item.name}</p>
                                    {isDocument(item) && (
                                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                                        <span className={isMobile ? "text-[0.65rem]" : ""}>{formatDate(item.createdAt)} • {item.size}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className={`${isMobile ? "mt-1 ml-11" : "mt-0"} sm:mt-0 flex items-center`}>
                                  {/* Same action buttons as "all" tab */}
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => startRenaming(
                                      item.id,
                                      item.name,
                                      isFolder(item) ? 'folder' : 'document'
                                    )}
                                    title="Rename"
                                    className="h-8 w-8"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  
                                  {isDocument(item) && (
                                    <>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        title="Download"
                                        className="h-8 w-8"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        title="Share"
                                        className="h-8 w-8"
                                      >
                                        <Share2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => {
                                      if (isFolder(item)) {
                                        handleDeleteFolder(item.id);
                                      } else {
                                        handleDeleteDocument(item.id);
                                      }
                                    }}
                                    title="Delete"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }).filter(Boolean)
                      ) : (
                        <div className={`${isMobile ? "p-4 text-sm" : "p-6"} text-center text-muted-foreground`}>
                          <p>No Excel documents found in this location.</p>
                          <div className="flex justify-center gap-2 mt-2">
                            <Button 
                              variant="outline"
                              onClick={() => document.getElementById('file-upload-input')?.click()}
                              size={isMobile ? "sm" : "default"}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Upload Spreadsheet
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </div>
          </CardHeader>
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
