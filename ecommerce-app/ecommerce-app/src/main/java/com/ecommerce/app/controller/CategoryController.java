package com.ecommerce.app.controller;

import com.ecommerce.app.entity.Category;
import com.ecommerce.app.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@CrossOrigin("*")
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        return service.saveCategory(category);
    }

    @GetMapping
    public List<Category> getCategories() {
        return service.getAllCategories();
    }
}