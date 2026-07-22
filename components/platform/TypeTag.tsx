import {Tag} from './Tag';

type TypeTagProps = {
  children: React.ReactNode;
};

export function TypeTag({children}: TypeTagProps) {
  return <Tag>{children}</Tag>;
}
