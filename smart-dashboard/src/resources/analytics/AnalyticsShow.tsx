import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  NumberField,
  ChipField,
  RichTextField,
} from 'react-admin';

export const AnalyticsShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Metric Name" />
      <NumberField source="value" label="Value" />
      <ChipField source="category" label="Category" />
      <ChipField source="status" label="Status" />
      <DateField source="date" label="Date" showTime />
      <RichTextField source="description" label="Description" />
    </SimpleShowLayout>
  </Show>
);