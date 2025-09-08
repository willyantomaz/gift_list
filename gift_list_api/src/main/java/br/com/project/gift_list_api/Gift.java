package br.com.project.gift_list_api;

import jakarta.persistence.*;

@Entity
@Table(name = "gift")
public class Gift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Float id;
    private String gift_name;
    private boolean selected;
    private String gift_giver;
    private String category;

    public float getId() {
        return id;
    }

    public void setId(float id) {
        this.id = id;
    }

    public String getGift_name() {
        return gift_name;
    }

    public void setGift_name(String gift_name) {
        this.gift_name = gift_name;
    }

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public String getGift_giver() {
        return gift_giver;
    }

    public void setGift_giver(String gift_giver) {
        this.gift_giver = gift_giver;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
