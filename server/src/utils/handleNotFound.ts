import { Response } from 'express';
import { UserInterface } from '../models';

type HandleNotFoundProps = {
  res: Response;
  data: UserInterface | UserInterface[];
  message: string;
};

const handleNotFound = (props: HandleNotFoundProps) => {
  const { res, data, message } = props;

  if (!data) {
    return res.status(404).json({ error: message });
  }
};

export default handleNotFound;
