package com.example.demo.train;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class TrainController {

    private final TrainService trainService;

    // GET /api/trains?origin=용산&destination=광주송정&date=2025-08-03
    @GetMapping("/api/trains")
    public List<Train> getTrains(@RequestParam String origin,
                                 @RequestParam String destination,
                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return trainService.searchTrains(origin, destination, date);
    }
}
