import { IConstruct } from "constructs";


export function nextAvailableId(scope: IConstruct, idBase: string): string {
  let idx = 0;
  let outputId = `${idBase}-${idx++}`;
  while (scope.node.tryFindChild(outputId)) {
    outputId = `${idBase}-${idx++}`;
  }

  return outputId;
}