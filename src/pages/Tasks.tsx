
import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { TasksHeader } from "@/components/tasks/TasksHeader";
import { TasksSearch } from "@/components/tasks/TasksSearch";
import { TaskTabs } from "@/components/tasks/TaskTabs";
import { TaskList } from "@/components/tasks/TaskList";
import { TasksProvider, useTasksContext } from "@/contexts/TasksContext";

const TasksContent = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { tasks } = useTasksContext();

  // Filter tasks based on active tab and search query
  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    // Filter by status based on active tab
    if (activeTab === "pending") {
      filtered = filtered.filter(task => task.status === "Pending");
    } else if (activeTab === "inProgress") {
      filtered = filtered.filter(task => task.status === "In Progress");
    } else if (activeTab === "completed") {
      filtered = filtered.filter(task => task.status === "Completed");
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        task => 
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="flex flex-col space-y-6">
      <TasksHeader />
      <TasksSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <TaskTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-6">
        <TaskList filteredTasks={filteredTasks} />
      </div>
    </div>
  );
};

const TasksPage = () => {
  return (
    <Layout>
      <TasksProvider>
        <TasksContent />
      </TasksProvider>
    </Layout>
  );
};

export default TasksPage;
