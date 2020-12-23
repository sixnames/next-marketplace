import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';
import { CART_COOKIE_KEY } from '@yagu/shared';

describe('Order', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(async () => {
    mockData = await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  const cartFragment = gql`
    fragment TestCartFragment on Cart {
      id
      totalPrice
      formattedTotalPrice
      productsCount
      products {
        id
      }
    }
  `;

  it('Should CRUD Order', async () => {
    const testClientWithoutHeaders = await authenticatedTestClient();

    // Should create cart and add one product
    const addProductToCartPayload = await testClientWithoutHeaders.mutate<any>(
      gql`
        mutation AddProductToCart($input: AddProductToCartInput!) {
          addProductToCart(input: $input) {
            success
            message
            cart {
              ...TestCartFragment
            }
          }
        }
        ${cartFragment}
      `,
      {
        variables: {
          input: {
            shopProductId: mockData.shopAProductA.id,
            amount: 2,
          },
        },
      },
    );
    const {
      data: { addProductToCart },
    } = addProductToCartPayload;
    expect(addProductToCart.success).toBeTruthy();
    expect(addProductToCart.cart.productsCount).toEqual(1);

    // Set cart id to cookies
    const { mutate, query } = await authenticatedTestClient({
      headers: {
        cookie: `${CART_COOKIE_KEY}=${addProductToCart.cart.id}`,
      },
    });

    // Should add second product to cart
    const addProductToCartPayloadC = await mutate<any>(
      gql`
        mutation AddProductToCart($input: AddProductToCartInput!) {
          addProductToCart(input: $input) {
            success
            message
            cart {
              ...TestCartFragment
            }
          }
        }
        ${cartFragment}
      `,
      {
        variables: {
          input: {
            shopProductId: mockData.shopAProductB.id,
            amount: 10,
          },
        },
      },
    );
    expect(addProductToCartPayloadC.data.addProductToCart.cart.productsCount).toEqual(2);

    // Order fragment
    const orderFragment = gql`
      fragment TestOrderFragment on Order {
        id
        itemId
        status {
          id
          nameString
        }
        customer {
          id
          itemId
          name
          email
          formattedPhone {
            raw
            readable
          }
          user {
            id
            name
          }
        }
        logs {
          id
          createdAt
          variant
          executor {
            id
            name
          }
        }
        totalPrice
        formattedTotalPrice
        productsCount
        createdAt
        updatedAt
        comment
        products {
          id
          amount
          cardNameString
          nameString
          descriptionString
          discountedPercent
          formattedOldPrice
          formattedPrice
          formattedTotalPrice
          discountedPercent
          shopProduct {
            id
            available
          }
          shop {
            id
            nameString
          }
          company {
            id
            nameString
          }
        }
      }
    `;

    // Should make an order
    const makeAnOrderInput = {
      name: 'name',
      phone: '+7 999 888-77-66',
      email: 'order@email.com',
      comment: 'comment',
    };
    const makeAnOrderPayload = await mutate<any>(
      gql`
        mutation MakeAnOrder($input: MakeAnOrderInput!) {
          makeAnOrder(input: $input) {
            success
            message
            order {
              ...TestOrderFragment
            }
            cart {
              ...TestCartFragment
            }
          }
        }
        ${orderFragment}
        ${cartFragment}
      `,
      {
        variables: {
          input: makeAnOrderInput,
        },
      },
    );
    expect(makeAnOrderPayload.data.makeAnOrder.success).toBeTruthy();
    expect(makeAnOrderPayload.data.makeAnOrder.order.customer.name).toEqual(makeAnOrderInput.name);
    expect(makeAnOrderPayload.data.makeAnOrder.order.customer.formattedPhone.readable).toEqual(
      makeAnOrderInput.phone,
    );
    expect(makeAnOrderPayload.data.makeAnOrder.order.customer.email).toEqual(
      makeAnOrderInput.email,
    );
    expect(makeAnOrderPayload.data.makeAnOrder.order.comment).toEqual(makeAnOrderInput.comment);
    expect(makeAnOrderPayload.data.makeAnOrder.cart.products).toHaveLength(0);
    expect(makeAnOrderPayload.data.makeAnOrder.cart.productsCount).toEqual(0);

    const meQueryPayload = await query<any>(gql`
      query {
        me {
          name
          itemId
          orders {
            id
          }
        }
      }
    `);
    const addedOrder = meQueryPayload.data.me.orders[0];
    if (!addedOrder) {
      throw Error('Order not added to the user');
    }
    expect(makeAnOrderPayload.data.makeAnOrder.order.id).toEqual(addedOrder.id);
    expect(makeAnOrderPayload.data.makeAnOrder.order.customer.itemId).toEqual(
      meQueryPayload.data.me.itemId,
    );

    // Should return paginated orders list
    const getAllOrdersPayload = await mutate<any>(gql`
      query {
        getAllOrders {
          page
          totalDocs
          docs {
            id
          }
        }
      }
    `);
    expect(getAllOrdersPayload.data.getAllOrders.docs[0].id).toEqual(addedOrder.id);
    expect(getAllOrdersPayload.data.getAllOrders.totalDocs).toEqual(1);
    expect(getAllOrdersPayload.data.getAllOrders.page).toEqual(1);

    // Should return order by ID
    const getOrderPayload = await mutate<any>(
      gql`
        query GetOrder($id: ID!) {
          getOrder(id: $id) {
            id
          }
        }
      `,
      {
        variables: {
          id: addedOrder.id,
        },
      },
    );
    expect(getOrderPayload.data.getOrder.id).toEqual(addedOrder.id);

    // Should repeat order
    const repeatOrderPayload = await mutate<any>(
      gql`
        mutation RepeatOrder($id: ID!) {
          repeatOrder(id: $id) {
            success
            message
            cart {
              ...TestCartFragment
            }
          }
        }
        ${cartFragment}
      `,
      {
        variables: {
          id: addedOrder.id,
        },
      },
    );
    expect(repeatOrderPayload.data.repeatOrder.success).toBeTruthy();
    expect(repeatOrderPayload.data.repeatOrder.cart.products).toHaveLength(
      makeAnOrderPayload.data.makeAnOrder.order.products.length,
    );

    // Should return order by ID
    const getMyOrderPayload = await mutate<any>(
      gql`
        query GetMyOrder($id: ID!) {
          getMyOrder(id: $id) {
            id
          }
        }
      `,
      {
        variables: {
          id: addedOrder.id,
        },
      },
    );
    expect(getMyOrderPayload.data.getMyOrder.id).toEqual(addedOrder.id);

    // Should return paginated orders list
    const getAllMyOrdersPayload = await mutate<any>(gql`
      query {
        getAllMyOrders {
          page
          totalDocs
          docs {
            id
          }
        }
      }
    `);
    expect(getAllMyOrdersPayload.data.getAllMyOrders.docs[0].id).toEqual(addedOrder.id);
    expect(getAllMyOrdersPayload.data.getAllMyOrders.totalDocs).toEqual(1);
    expect(getAllMyOrdersPayload.data.getAllMyOrders.page).toEqual(1);
  });
});
