export interface Duration {
  from: Date;
  to: Date;
}

export interface Rent {
  id: string;
  duration: Duration;
  email: string;
  workId: string;
  type: 'painting';
}