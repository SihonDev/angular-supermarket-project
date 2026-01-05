export class RegistrationDetails {
  public constructor(
    //We declare id as any so we can transform number of input to string freeily to get id's with a number that starts with 0 (In DB - 012345678 = 12345678)
    public id?: any,
    public email?: string,
    public password?: string,
    public city?: string,
    public street?: string,
    public firstName?: string,
    public lastName?: string
  ) {}
}