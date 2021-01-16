import { User as ApplicationUser } from '../modules/users/schemas/user.schema';

declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends ApplicationUser {}
}
