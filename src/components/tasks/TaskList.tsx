
import { Card, CardContent } from "@/components/ui/card";
import { CreateTaskDialog } from "@/components/dialogs/create-task-dialog";
import { TaskItem } from "./TaskItem";
import { useTasksContext, Task } from "@/contexts/TasksContext";

interface TaskListProps {
  filteredTasks: Task[];
  showCreateButton?: boolean;
  matterFilter?: string;
}

export const TaskList = ({ filteredTasks, showCreateButton = true, matterFilter }: TaskListProps) => {
  const displayTasks = matterFilter 
    ? filteredTasks.filter(task => task.caseTitle.toLowerCase().includes(matterFilter.toLowerCase()))
    : filteredTasks;

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {displayTasks.length > 0 ? (
            displayTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <p>No tasks found matching your criteria.</p>
              {showCreateButton && <CreateTaskDialog />}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
