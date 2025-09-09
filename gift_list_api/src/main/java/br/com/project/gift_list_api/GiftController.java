package br.com.project.gift_list_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gifts")
public class GiftController {

    @Autowired
    private GiftRepository giftRepository;

    @GetMapping
    public List<Gift> listGifts() {
        return giftRepository.findAll();
    }


    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public Gift addGift(@RequestBody Gift gift) {
        return giftRepository.save(gift);
    }

    @PutMapping("update/{id}")
    public Gift updateGift(@PathVariable Long id, Gift updatedGift) {
        Gift gift = giftRepository.findById(id).orElseThrow(() -> new RuntimeException("Gift not found"));
//        gift.setGift_name(updatedGift.getGift_name());
        gift.setSelected(updatedGift.isSelected());
//        gift.setGift_giver(updatedGift.getGift_giver());
//        gift.setCategory(updatedGift.getCategory());
        return giftRepository.save(gift);
    }

    @DeleteMapping("delete/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void deleteGift(@PathVariable Long id) {
        giftRepository.deleteById(id);
    }


    @GetMapping("/{id}")
    public Gift getGiftById(@PathVariable Long id) {
        return giftRepository.findById(id).orElseThrow(() -> new RuntimeException("Gift not found"));
    }


}
