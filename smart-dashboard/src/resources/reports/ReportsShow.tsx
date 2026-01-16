import { Show, SimpleShowLayout, TextField, DateField, ChipField } from 'react-admin';

export const ReportsShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="title" label="Title" />
      <TextField source="type" label="Type" />
      <ChipField source="status" label="Status" />
      <TextField source="author" label="Author" />
      <TextField source="department" label="Department" />
      <DateField source="date" label="Date" showTime />
      <TextField source="summary" label="Summary" />
    </SimpleShowLayout>
  </Show>
);