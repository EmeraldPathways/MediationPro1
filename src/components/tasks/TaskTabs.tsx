
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTasksContext } from "@/contexts/TasksContext";

interface TaskTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const TaskTabs = ({ activeTab, setActiveTab }: TaskTabsProps) => {
  const { tasks } = useTasksContext();
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="all">
          All ({tasks.length})
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pending ({tasks.filter(t => t.status === "Pending").length})
        </TabsTrigger>
        <TabsTrigger value="inProgress">
          In Progress ({tasks.filter(t => t.status === "In Progress").length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({tasks.filter(t => t.status === "Completed").length})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
