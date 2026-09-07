package sn.ucad.tdsi.crypto.mapper;

import org.mapstruct.Mapper;
import sn.ucad.tdsi.crypto.dto.UserDto;
import sn.ucad.tdsi.crypto.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toDto(User user);

    User toEntity(UserDto userDto);
}
