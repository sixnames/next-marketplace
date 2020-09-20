import React from 'react';
import { RoleContentInterface } from './RolesContent';
import {
  useGetAllAppNavItemsQuery,
  useSetRoleAllowedNavItemMutation,
} from '../../generated/apolloComponents';
import RequestError from '../../components/RequestError/RequestError';
import Spinner from '../../components/Spinner/Spinner';
import InnerWide from '../../components/Inner/InnerWide';
import classes from './RoleAppNavigation.module.css';
import Checkbox from '../../components/FormElements/Checkbox/Checkbox';
import { GET_ROLE_QUERY } from '../../graphql/query/roles';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import getBooleanFromArray from '../../utils/getBooleanFromArray';

const RoleAppNavigation: React.FC<RoleContentInterface> = ({ role }) => {
  const { allowedAppNavigation } = role;
  const { data, loading, error } = useGetAllAppNavItemsQuery();
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({});

  const [setRoleAllowedNavItemMutation] = useSetRoleAllowedNavItemMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.setRoleAllowedNavItem),
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_ROLE_QUERY,
        variables: {
          id: role.id,
        },
      },
    ],
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data) {
    return <RequestError />;
  }

  const { getAllAppNavItems } = data;

  return (
    <InnerWide>
      {getAllAppNavItems.map(({ id, nameString, children, path }) => {
        const isChildrenChecked = () => {
          const childrenIds = children?.map(({ id }) => id);
          if (!childrenIds) {
            return false;
          }
          const boolArray = childrenIds.map((id) =>
            getBooleanFromArray(allowedAppNavigation, (allowedId) => allowedId === id),
          );
          const filteredBoolArray = boolArray.filter((bool) => bool);
          return filteredBoolArray.length > 0;
        };

        const checked = !path ? isChildrenChecked() : allowedAppNavigation.includes(id);

        return (
          <div className={classes.navItem} key={id}>
            <label className={classes.label}>
              <Checkbox
                testId={nameString}
                name={nameString}
                checked={checked}
                value={id}
                disabled={!path}
                onChange={() => {
                  showLoading();
                  setRoleAllowedNavItemMutation({
                    variables: {
                      input: {
                        navItemId: id,
                        roleId: role.id,
                      },
                    },
                  });
                }}
              />
              <span className={classes.labelText}>{nameString}</span>
            </label>
            {children && children.length > 0 && (
              <div>
                {children.map(({ id, nameString }) => {
                  return (
                    <div key={id} className={classes.children}>
                      <label className={classes.label}>
                        <Checkbox
                          testId={nameString}
                          name={nameString}
                          checked={allowedAppNavigation.includes(id)}
                          value={id}
                          onChange={() => {
                            showLoading();
                            setRoleAllowedNavItemMutation({
                              variables: {
                                input: {
                                  navItemId: id,
                                  roleId: role.id,
                                },
                              },
                            });
                          }}
                        />
                        <span className={classes.labelText}>{nameString}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </InnerWide>
  );
};

export default RoleAppNavigation;
