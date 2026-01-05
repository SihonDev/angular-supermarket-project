export class RegistrationFormStepOneDetails {
  public constructor(
    public id?: any,
    public email?: string,
    public password?: string,
    public passwordConfirmation?: string
  ) {}

  static passwordConfirmation(passwordConfirmation: any) {
    throw new Error('Method not implemented.');
  }
  static password(password: any) {
    throw new Error('Method not implemented.');
  }
  static email(email: any) {
    throw new Error('Method not implemented.');
  }
  static id(id: any) {
    throw new Error('Method not implemented.');
  }
}
