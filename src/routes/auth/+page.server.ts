import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

export async function load() {
  const form = await superValidate(zod(schema));
  return { form };
}
