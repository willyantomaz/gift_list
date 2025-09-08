package br.com.project.gift_list_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
