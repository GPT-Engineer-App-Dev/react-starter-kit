import { useState } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, Table, Tbody, Td, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import { useDrinks, useAddDrink, useUpdateDrink, useDeleteDrink } from "../integrations/supabase/index.js";

const DrinksManager = () => {
  const { data: drinks, isLoading, isError } = useDrinks();
  const addDrinkMutation = useAddDrink();
  const updateDrinkMutation = useUpdateDrink();
  const deleteDrinkMutation = useDeleteDrink();

  const [formState, setFormState] = useState({ name: "", percentage: "", country: "" });
  const [editState, setEditState] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editState) {
        await updateDrinkMutation.mutateAsync({ ...formState, id: editState });
      } else {
        await addDrinkMutation.mutateAsync(formState);
      }
      setFormState({ name: "", percentage: "", country: "" });
      setEditState(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (drink) => {
    setFormState({ name: drink.name, percentage: drink.percentage, country: drink.country });
    setEditState(drink.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDrinkMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting drink:", error);
    }
  };

  if (isLoading) return <Box>Loading...</Box>;
  if (isError) return <Box>Error loading drinks</Box>;

  return (
    <Container maxW="container.md" py={4}>
      <Box as="form" onSubmit={handleSubmit} mb={4}>
        <VStack spacing={4}>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={formState.name} onChange={handleChange} />
          </FormControl>
          <FormControl id="percentage" isRequired>
            <FormLabel>Percentage</FormLabel>
            <Input name="percentage" value={formState.percentage} onChange={handleChange} />
          </FormControl>
          <FormControl id="country" isRequired>
            <FormLabel>Country</FormLabel>
            <Input name="country" value={formState.country} onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="teal">
            {editState ? "Update Drink" : "Add Drink"}
          </Button>
        </VStack>
      </Box>

      {drinks && drinks.length > 0 ? (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Percentage</Th>
              <Th>Country</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {drinks.map((drink) => (
              <Tr key={drink.id}>
                <Td>{drink.name}</Td>
                <Td>{drink.percentage}</Td>
                <Td>{drink.country}</Td>
                <Td>
                  <Button size="sm" onClick={() => handleEdit(drink)} mr={2}>
                    Edit
                  </Button>
                  <Button size="sm" colorScheme="red" onClick={() => handleDelete(drink.id)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Box>No drinks available</Box>
      )}
    </Container>
  );
};

export default DrinksManager;