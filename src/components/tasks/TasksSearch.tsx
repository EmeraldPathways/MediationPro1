
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TasksSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const TasksSearch = ({ searchQuery, setSearchQuery }: TasksSearchProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full bg-background py-2 pl-8 pr-4 text-sm border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button variant="outline" className="flex gap-2 w-full md:w-auto">
        <Filter className="h-4 w-4" />
        Filter
      </Button>
    </div>
  );
};
