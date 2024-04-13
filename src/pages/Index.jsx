import { useState } from "react";
import { Box, Button, Checkbox, Flex, Heading, IconButton, Input, Select, Stack, Text, useToast, VStack } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaSort } from "react-icons/fa";

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("all");
  const toast = useToast();

  const handleAddTask = () => {
    if (!input) {
      toast({
        title: "Error",
        description: "Task description can't be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const newTask = {
      id: Date.now(),
      text: input,
      dueDate,
      priority,
      isCompleted: false,
    };
    setTasks([...tasks, newTask]);
    setInput("");
    setDueDate("");
    setPriority("Medium");
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleComplete = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task)));
  };

  const handleEdit = (id, newText) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text: newText } : task)));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.isCompleted;
    if (filter === "completed") return task.isCompleted;
    return true;
  });

  const sortTasks = (type) => {
    const sortedTasks = [...tasks];
    if (type === "date") {
      sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (type === "priority") {
      const priorityLevels = { High: 3, Medium: 2, Low: 1 };
      sortedTasks.sort((a, b) => priorityLevels[b.priority] - priorityLevels[a.priority]);
    } else if (type === "completed") {
      sortedTasks.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
    }
    setTasks(sortedTasks);
  };

  return (
    <VStack p={5}>
      <Heading mb="8">Todo App</Heading>
      <Flex>
        <Input placeholder="Add a new task" value={input} onChange={(e) => setInput(e.target.value)} />
        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} ml={2} />
        <Select value={priority} onChange={(e) => setPriority(e.target.value)} ml={2}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </Select>
        <IconButton icon={<FaPlus />} onClick={handleAddTask} ml={2} />
      </Flex>
      <Box mt={4}>
        <Button onClick={() => sortTasks("date")}>Sort by Date</Button>
        <Button onClick={() => sortTasks("priority")} ml={2}>
          Sort by Priority
        </Button>
        <Button onClick={() => sortTasks("completed")} ml={2}>
          Sort by Completion
        </Button>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} ml={2}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </Select>
      </Box>
      <Stack mt={4} w="100%">
        {filteredTasks.map((task) => (
          <Flex key={task.id} p={3} w="100%" borderWidth="1px" borderRadius="lg" alignItems="center">
            <Checkbox isChecked={task.isCompleted} onChange={() => handleComplete(task.id)} mr={2} />
            <Text flex={1} as={task.isCompleted ? "del" : undefined}>
              {task.text}
            </Text>
            <IconButton icon={<FaEdit />} onClick={() => handleEdit(task.id, prompt("Edit task:", task.text))} />
            <IconButton icon={<FaTrash />} onClick={() => handleDelete(task.id)} ml={2} />
          </Flex>
        ))}
      </Stack>
    </VStack>
  );
};

export default Index;
