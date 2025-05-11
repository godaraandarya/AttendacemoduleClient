if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/prashant/.gradle/caches/8.12/transforms/65639fbefb204ed5a1e21df2ae126133/transformed/hermes-android-0.78.2-release/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/prashant/.gradle/caches/8.12/transforms/65639fbefb204ed5a1e21df2ae126133/transformed/hermes-android-0.78.2-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

