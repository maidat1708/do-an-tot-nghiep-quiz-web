package com.example.samuel_shop.Mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.common.request.ProductKafkaRequest;
import com.example.samuel_shop.DTO.Request.ProductRequest;
import com.example.samuel_shop.Entities.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "view", ignore = true)
    Product toProduct(ProductRequest productRequest);


    @Mapping(target = "id", ignore = true) 
    @Mapping(target = "view", ignore = true) 
    void updateProduct(@MappingTarget Product product, ProductRequest productRequest);

    ProductKafkaRequest tProductKafkaRequest(Product product);
}
