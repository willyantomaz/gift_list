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
    public Gift updateGift(@PathVariable Long id,@RequestBody Gift updatedGift) {
        Gift gift = giftRepository.findById(id).orElseThrow(() -> new RuntimeException("Gift not found"));
        gift.setGift_name(updatedGift.getGift_name());
        gift.setSelected(updatedGift.isSelected());
        gift.setGift_giver(updatedGift.getGift_giver());
        gift.setCategory(updatedGift.getCategory());
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

    @PutMapping("/select")
    public ResponseEntity<String> selectGift(@RequestBody GiftSelectDTO giftSelectDTO) {
        if (giftSelectDTO.getGifts().size() != 1) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You can only select one gift");
        }
        giftSelectDTO.getGifts().forEach(id -> {
            Gift gift = giftRepository.findById(id.longValue()).orElseThrow(() -> new RuntimeException("Gift not found"));
            if (gift.isSelected()) {
                throw new RuntimeException("Gift already selected");

            }
            gift.setSelected(true);
            gift.setGift_giver(giftSelectDTO.getName());
            giftRepository.save(gift);
        });

        return ResponseEntity.ok("Present selected successfully");
    }
}
