import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  private users: { id: string; email: string; password: string }[] = []

  constructor() {
    this.initializeUsers()
  }

  private async initializeUsers() {
    const hashed = await bcrypt.hash('password', 10)
    this.users = [
      {
        id: '1',
        email: 'test@example.com',
        password: hashed,
      },
    ]
  }

  async findByEmail(email: string) {
    return this.users.find(user => user.email === email)
  }
}