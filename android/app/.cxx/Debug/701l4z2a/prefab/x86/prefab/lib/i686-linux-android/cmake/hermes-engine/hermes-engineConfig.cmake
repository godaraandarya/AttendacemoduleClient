if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/prashant/.gradle/caches/8.12/transforms/1a2e1d0d43580ca5ffbb07f7df776d59/transformed/hermes-android-0.78.2-debug/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/prashant/.gradle/caches/8.12/transforms/1a2e1d0d43580ca5ffbb07f7df776d59/transformed/hermes-android-0.78.2-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

