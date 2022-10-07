import SingleProduct, { SINGLE_ITEM_QUERY } from "../components/SingleProduct";
import { fakeItem } from "../lib/testUtils";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
const product = fakeItem();
//creating a mocks data
const mocks = [
  {
    //when someone request this query and avriables
    request: {
      query: SINGLE_ITEM_QUERY,
      variables: {
        id: "123",
      },
    },

    //Return this data

    result: {
      data: {
        Product: product,
      },
    },
  },
];

describe("<Single Product/>", () => {
  it("it render the proper data", async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SingleProduct id="123" />
      </MockedProvider>
    );
    await screen.findByTestId("singleProduct");
  });

  it("Errors out when an item is no found", async () => {
    const errorMock = [
      {
        request: {
          query: SINGLE_ITEM_QUERY,
          variables: {
            id: "123",
          },
        },
        result: {
          errors: [{ message: "Item not found!!!" }],
        },
      },
    ];
    const { container, debug } = render(
      <MockedProvider mocks={errorMock}>
        <SingleProduct id="123" />
      </MockedProvider>
    );
    await screen.findByTestId("graphql-error");
    expect(container).toHaveTextContent("Shoot!");
    expect(container).toHaveTextContent("Item not found!!!");
  });
});
