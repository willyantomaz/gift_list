export class Gift {
  id: number;
  gift_name: string;
  selected: boolean;
  gift_giver: string;
  category: string;

  constructor(
    id: number,
    gift_name: string,
    selected: boolean,
    gift_giver: string,
    category: string
  ) {
    this.id = id;
    this.gift_name = gift_name;
    this.selected = selected;
    this.gift_giver = gift_giver;
    this.category = category;
  }
}
