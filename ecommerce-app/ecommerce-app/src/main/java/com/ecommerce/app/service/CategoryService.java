package com.ecommerce.app.service;

import com.ecommerce.app.entity.Category;
import com.ecommerce.app.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public Category saveCategory(Category category) {
        return repository.save(category);
    }

    public List<Category> getAllCategories() {
        return repository.findAll();
    }
}