package br.com.project.gift_list_api;

import java.util.List;

public class GiftSelectDTO {

    private String name;

    private List<Integer> gifts;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Integer> getGifts() {
        return gifts;
    }

    public void setGifts(List<Integer> gifts) {
        this.gifts = gifts;
    }
}
