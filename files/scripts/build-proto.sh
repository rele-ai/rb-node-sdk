# #------------------------- Old Script -------------------------------
# #!/bin/bash

# echo "compiling cognition server gRPC instance."

# # export paths
# PATH="$HOME/go/bin:$PATH"; export PATH;
# GOPATH="$HOME/devel/googleapis:$HOME/go:$GOPATH"; export GOPATH;

# # create pb dir
# mkdir -p ./src/pb

# # build tools
# grpc_tools_node_protoc \
#     -I ./files/proto \
#     -I $GOPATH \
#     --js_out=import_style=commonjs,binary:./src/pb/ \
#     --grpc_out=./src/pb \
#     --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
#     "integratedapp.proto"


#------------------------- New Script -------------------------------
#!/bin/bash

echo "compiling cognition server gRPC instance."

# export paths
PATH="$HOME/go/bin:$PATH"; export PATH;
GOPATH="$HOME/devel/googleapis:$HOME/go:$GOPATH"; export GOPATH;

# create pb dir
mkdir -p ./src/pb

# build tools
grpc_tools_node_protoc \
    -I ../proto \
    -I $GOPATH \
    --js_out=import_style=commonjs,binary:./src/pb/ \
    --grpc_out=./src/pb \
    "integratedapp.proto"

