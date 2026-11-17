/** After sign-in, only the known example route is honored; anything else goes to My projects. */
export function exampleDestination(project: unknown) {
  return project === 'example' ? '/projects/example' : '/projects';
}
