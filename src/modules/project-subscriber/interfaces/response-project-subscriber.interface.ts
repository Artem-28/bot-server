export interface IResponseSubscriberUser {
  id: number;
  subscriptionAt: Date;
  email?: string;
}

export interface IResponseSubscriberProject {
  id: number;
  subscriptionAt: Date;
  title?: string;
}

export interface IResponseCombineUserSubscriber
  extends IResponseSubscriberUser {
  projects: IResponseSubscriberProject[];
}
