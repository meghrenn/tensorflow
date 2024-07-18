/* Copyright 2024 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
#ifndef TENSORFLOW_COMPILER_MLIR_LITE_STABLEHLO_TRANSFORMS_LEGALIZE_HLO_CONVERSIONS_CONV_H_
#define TENSORFLOW_COMPILER_MLIR_LITE_STABLEHLO_TRANSFORMS_LEGALIZE_HLO_CONVERSIONS_CONV_H_

#include "mlir/Transforms/DialectConversion.h"  // from @llvm-project
#include "xla/mlir_hlo/mhlo/IR/hlo_ops.h"

namespace mlir::odml {

// Legalizes mhlo.convolution to the corresponding tfl op.
//
// Only considers convolutions with tfl-native layout and trivial (no)
// padding. It is expected that convolutions will re-layouted in upstream
// prepare pass. Additionally it is expected that padding will be pulled out
// into an explicit mhlo.pad op in said prepare pass.
//
// Note: "tfl-native" layouts are as follows:
// 2D : [b, 0, 1, f]x[o, 0, 1, i]->[b, 0, 1, f]
// 3D : [b, 0, 1, 2, f]x[0, 1, 2, i, o]->[b, 0, 1, 2, f]
//
// Matches: mhlo.convolution
//   layout:        tfl-native
//   padding:       trivial (all 0)
//   lhs_dilations: trivial (all 1)
//   rhs_dilations: any
//   strides:       any
//   feature_group: 1 or kernel_input_channel * feature_group = input_channel
//   batch_group:   trivial (1)
//   reversal:      trivial (all False)
//   shape:         static
//
// This pattern emits TFL convs based on the following decision tree:
// if lhs_dilations are trivial
//   if feature_group == 1 or kernel_in_channel * feature_group = in_channel
//      if rank == 4
//        tfl.conv_2D
//      if rank == 5
//        tfl.conv_3D  TODO: b/352952205 - Add support.
//   else
//      tfl.depthwise_conv TODO: b/352954597 - Add support.
// else:
//   tfl.transpose_conv TODO: b/352954597 - Add support.
class LegalizeConv : public OpConversionPattern<mhlo::ConvolutionOp> {
 public:
  using OpConversionPattern::OpConversionPattern;
  LogicalResult matchAndRewrite(
      mhlo::ConvolutionOp op, OpAdaptor adaptor,
      ConversionPatternRewriter& rewriter) const final;
};

bool IsConvLegal(mhlo::ConvolutionOp op);

}  // namespace mlir::odml

#endif  // TENSORFLOW_COMPILER_MLIR_LITE_STABLEHLO_TRANSFORMS_LEGALIZE_HLO_CONVERSIONS_CONV_H_
