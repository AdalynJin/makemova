export const canPickScreenshot = true;

export async function pickScreenshot(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg';
    const finish = () => {
      const file = input.files?.[0] ?? null;
      input.remove();
      resolve(file);
    };
    input.addEventListener('change', finish, { once: true });
    input.addEventListener('cancel', finish, { once: true });
    input.hidden = true;
    document.body.appendChild(input);
    input.click();
  });
}
