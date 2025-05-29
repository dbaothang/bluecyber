import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const TaskItem = ({ task, onEdit, onDelete }) => {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center">
            <span className="mr-2">{task.icon}</span>
            <h3 className="font-medium text-gray-800">{task.name}</h3>
          </div>
          {task.description && (
            <p className="mt-1 text-sm text-gray-600">{task.description}</p>
          )}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={onEdit}
            className="p-1 text-gray-500 hover:text-green-500"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-500 hover:text-red-500"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
